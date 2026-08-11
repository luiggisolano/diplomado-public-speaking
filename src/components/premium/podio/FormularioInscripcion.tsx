"use client";

/*
  Formulario de inscripción de la sección de cierre. Componente cliente aparte porque
  LandingPodio es un Server Component y no puede sostener estado ni manejadores.

  Tres decisiones que no son evidentes leyendo el markup:

  · LA VALIDACIÓN NO VIVE AQUÍ. Las reglas están en lib/inscripcion y las ejecuta también el
    servidor, que es quien manda. Aquí se ejecutan antes de la petición únicamente para que la
    persona vea el error pegado a su campo sin pagar un viaje de red, y los errores que
    devuelve el servidor sobrescriben a los locales sin discusión.

  · LAS DOS REGIONES DE AVISO ESTÁN SIEMPRE EN EL DOM, vacías mientras no hay nada que decir.
    Un lector de pantalla anuncia el contenido que aparece DENTRO de una región viva que ya
    existía; si la región se insertara junto con su mensaje, el anuncio se pierde en varios
    lectores. La de éxito es `role="status"` y espera turno; la de fallo es `role="alert"` e
    interrumpe, porque exige una corrección inmediata.

  · EL FOCO SE MUEVE SIEMPRE. Al primer campo con problema cuando algo falla, y al panel de
    confirmación cuando el envío entra. Sin eso, quien navega por teclado o con lector se
    queda al final del formulario sin saber qué pasó.

  El campo trampa se oculta sacándolo del lienzo y recortándolo a un píxel, y no con
  `display:none`: los rellenadores automáticos más burdos descartan lo que el navegador no
  dibuja, así que un campo no dibujado deja de ser una trampa. Queda fuera del árbol de
  accesibilidad con aria-hidden y fuera del recorrido de tabulación con tabIndex -1, de modo
  que ningún lector de pantalla lo anuncia ni el tabulador lo pisa.
*/

import { useId, useRef, useState, type FormEvent } from "react";
import {
  CAMPO_TRAMPA,
  LIMITES_DE_LONGITUD,
  TEXTO_DEL_CONSENTIMIENTO,
  validarInscripcion,
  type CampoDeInscripcion,
  type ErroresDeInscripcion,
} from "@/lib/inscripcion";

const RUTA_DEL_ENDPOINT = "/api/inscripcion";
const TEXTO_MIENTRAS_SE_ENVIA = "Enviando tus datos";
const TEXTO_PARA_OTRA_INSCRIPCION = "Inscribir a otra persona";
const AYUDA_DEL_TELEFONO = "Diez dígitos, o el formato internacional con prefijo del país.";
const MENSAJE_DE_FALLO_DE_RED =
  "No pudimos enviar tus datos. Revisa tu conexión y vuelve a intentarlo, o escríbenos por WhatsApp.";
const MENSAJE_DE_RESPUESTA_INESPERADA =
  "El servidor respondió de forma inesperada. Vuelve a intentarlo o escríbenos por WhatsApp.";

type EstadoDelEnvio = "inactivo" | "enviando" | "enviado" | "fallido";

type ValoresDelFormulario = {
  nombre: string;
  correo: string;
  telefono: string;
  consentimiento: boolean;
  trampa: string;
};

const VALORES_INICIALES: ValoresDelFormulario = {
  nombre: "",
  correo: "",
  telefono: "",
  consentimiento: false,
  trampa: "",
};

/*
  El título visible de la tarjeta lo pone la página, así que el nombre accesible del
  formulario llega por referencia y no duplicado aquí: un <form> sin nombre no es una región
  para la tecnología asistiva, y con dos nombres distintos sería peor que sin ninguno.
*/
type FormularioInscripcionProps = {
  textoDeEnvio: string;
  idDelTitulo: string;
};

type RespuestaDelServidor = {
  ok?: boolean;
  mensaje?: string;
  errores?: ErroresDeInscripcion;
};

export function FormularioInscripcion({ textoDeEnvio, idDelTitulo }: FormularioInscripcionProps) {
  const prefijoDeIdentificadores = useId();
  const [valores, setValores] = useState<ValoresDelFormulario>(VALORES_INICIALES);
  const [errores, setErrores] = useState<ErroresDeInscripcion>({});
  const [estado, setEstado] = useState<EstadoDelEnvio>("inactivo");
  const [mensajeDeFallo, setMensajeDeFallo] = useState("");
  const [mensajeDeExito, setMensajeDeExito] = useState("");

  const referenciaDelNombre = useRef<HTMLInputElement | null>(null);
  const referenciaDelCorreo = useRef<HTMLInputElement | null>(null);
  const referenciaDelTelefono = useRef<HTMLInputElement | null>(null);
  const referenciaDelConsentimiento = useRef<HTMLInputElement | null>(null);
  const referenciaDeLaConfirmacion = useRef<HTMLDivElement | null>(null);

  const identificadorDe = (sufijo: string) => `${prefijoDeIdentificadores}-${sufijo}`;

  const referenciaDelCampo = (campo: CampoDeInscripcion) => {
    if (campo === "nombre") return referenciaDelNombre;
    if (campo === "correo") return referenciaDelCorreo;
    if (campo === "telefono") return referenciaDelTelefono;
    return referenciaDelConsentimiento;
  };

  const llevarElFocoA = (campo: CampoDeInscripcion) => {
    referenciaDelCampo(campo).current?.focus();
  };

  const describirCampo = (campo: CampoDeInscripcion, ayuda?: string) => {
    const descriptores = [ayuda, errores[campo] ? identificadorDe(`${campo}-error`) : undefined];
    const unidos = descriptores.filter(Boolean).join(" ");
    return unidos.length > 0 ? unidos : undefined;
  };

  const cambiarTexto = (campo: "nombre" | "correo" | "telefono" | "trampa", valor: string) => {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  };

  const reiniciarElFormulario = () => {
    setValores(VALORES_INICIALES);
    setErrores({});
    setMensajeDeFallo("");
    setMensajeDeExito("");
    setEstado("inactivo");
    window.requestAnimationFrame(() => referenciaDelNombre.current?.focus());
  };

  const atenderElEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (estado === "enviando") {
      return;
    }

    const cuerpo = {
      nombre: valores.nombre,
      correo: valores.correo,
      telefono: valores.telefono,
      consentimiento: valores.consentimiento,
      [CAMPO_TRAMPA]: valores.trampa,
    };

    const revisionLocal = validarInscripcion(cuerpo);

    if (!revisionLocal.esValido) {
      setErrores(revisionLocal.errores);
      setMensajeDeFallo("Faltan datos por corregir. Revisa los campos marcados.");
      setEstado("inactivo");
      llevarElFocoA(revisionLocal.primerCampoConError);
      return;
    }

    setEstado("enviando");
    setErrores({});
    setMensajeDeFallo("");

    try {
      const respuesta = await fetch(RUTA_DEL_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cuerpo),
      });

      let contenido: RespuestaDelServidor = {};

      try {
        contenido = (await respuesta.json()) as RespuestaDelServidor;
      } catch (fallo) {
        console.error("inscripcion.respuesta_no_json", fallo);
        setEstado("fallido");
        setMensajeDeFallo(MENSAJE_DE_RESPUESTA_INESPERADA);
        return;
      }

      if (respuesta.ok && contenido.ok) {
        setMensajeDeExito(contenido.mensaje ?? "Recibimos tu solicitud.");
        setEstado("enviado");
        window.requestAnimationFrame(() => referenciaDeLaConfirmacion.current?.focus());
        return;
      }

      const erroresDelServidor = contenido.errores ?? {};
      const camposConError = Object.keys(erroresDelServidor) as CampoDeInscripcion[];

      setErrores(erroresDelServidor);
      setMensajeDeFallo(contenido.mensaje ?? MENSAJE_DE_RESPUESTA_INESPERADA);
      setEstado("inactivo");

      if (camposConError.length > 0) {
        llevarElFocoA(camposConError[0]);
      }
    } catch (fallo) {
      console.error("inscripcion.fallo_de_red", fallo);
      setEstado("fallido");
      setMensajeDeFallo(MENSAJE_DE_FALLO_DE_RED);
    }
  };

  const seEstaEnviando = estado === "enviando";

  return (
    <div className="pod-formulario">
      <p className="pod-anuncio" role="status" aria-live="polite" aria-atomic="true">
        {estado === "enviado" ? mensajeDeExito : null}
      </p>

      <div className="pod-aviso" role="alert" aria-atomic="true">
        {estado !== "enviado" && mensajeDeFallo ? mensajeDeFallo : null}
      </div>

      {estado === "enviado" ? (
        <div
          className="pod-confirmacion"
          ref={referenciaDeLaConfirmacion}
          tabIndex={-1}
          data-estado="enviado"
        >
          <p className="pod-confirmacion__titulo font-serif">Solicitud enviada</p>
          <p className="pod-confirmacion__linea">{mensajeDeExito}</p>
          <button
            type="button"
            className="pod-boton pod-boton--secundario pod-boton--compacto"
            onClick={reiniciarElFormulario}
          >
            {TEXTO_PARA_OTRA_INSCRIPCION}
          </button>
        </div>
      ) : (
        <form
          className="pod-formulario__cuerpo"
          onSubmit={atenderElEnvio}
          aria-labelledby={idDelTitulo}
          noValidate
        >
          <div className="pod-campo">
            <label className="pod-campo__etiqueta tech-label" htmlFor={identificadorDe("nombre")}>
              Nombre completo
            </label>
            <input
              className="pod-campo__control"
              id={identificadorDe("nombre")}
              ref={referenciaDelNombre}
              name="nombre"
              type="text"
              autoComplete="name"
              maxLength={LIMITES_DE_LONGITUD.nombre.maximo}
              required
              value={valores.nombre}
              onChange={(evento) => cambiarTexto("nombre", evento.target.value)}
              aria-invalid={errores.nombre ? true : undefined}
              aria-describedby={describirCampo("nombre")}
              disabled={seEstaEnviando}
            />
            {errores.nombre ? (
              <p className="pod-campo__error" id={identificadorDe("nombre-error")}>
                {errores.nombre}
              </p>
            ) : null}
          </div>

          <div className="pod-campo">
            <label className="pod-campo__etiqueta tech-label" htmlFor={identificadorDe("correo")}>
              Correo electrónico
            </label>
            <input
              className="pod-campo__control"
              id={identificadorDe("correo")}
              ref={referenciaDelCorreo}
              name="correo"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITES_DE_LONGITUD.correo.maximo}
              required
              value={valores.correo}
              onChange={(evento) => cambiarTexto("correo", evento.target.value)}
              aria-invalid={errores.correo ? true : undefined}
              aria-describedby={describirCampo("correo")}
              disabled={seEstaEnviando}
            />
            {errores.correo ? (
              <p className="pod-campo__error" id={identificadorDe("correo-error")}>
                {errores.correo}
              </p>
            ) : null}
          </div>

          <div className="pod-campo">
            <label className="pod-campo__etiqueta tech-label" htmlFor={identificadorDe("telefono")}>
              Teléfono
            </label>
            <input
              className="pod-campo__control"
              id={identificadorDe("telefono")}
              ref={referenciaDelTelefono}
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LIMITES_DE_LONGITUD.telefono.maximo}
              required
              value={valores.telefono}
              onChange={(evento) => cambiarTexto("telefono", evento.target.value)}
              aria-invalid={errores.telefono ? true : undefined}
              aria-describedby={describirCampo("telefono", identificadorDe("telefono-ayuda"))}
              disabled={seEstaEnviando}
            />
            <p className="pod-campo__ayuda" id={identificadorDe("telefono-ayuda")}>
              {AYUDA_DEL_TELEFONO}
            </p>
            {errores.telefono ? (
              <p className="pod-campo__error" id={identificadorDe("telefono-error")}>
                {errores.telefono}
              </p>
            ) : null}
          </div>

          <div className="pod-campo">
            <div className="pod-consentimiento">
              <input
                className="pod-consentimiento__marca"
                id={identificadorDe("consentimiento")}
                ref={referenciaDelConsentimiento}
                name="consentimiento"
                type="checkbox"
                required
                checked={valores.consentimiento}
                onChange={(evento) =>
                  setValores((anteriores) => ({
                    ...anteriores,
                    consentimiento: evento.target.checked,
                  }))
                }
                aria-invalid={errores.consentimiento ? true : undefined}
                aria-describedby={describirCampo("consentimiento")}
                disabled={seEstaEnviando}
              />
              <label
                className="pod-consentimiento__texto"
                htmlFor={identificadorDe("consentimiento")}
              >
                {TEXTO_DEL_CONSENTIMIENTO}
              </label>
            </div>
            {errores.consentimiento ? (
              <p className="pod-campo__error" id={identificadorDe("consentimiento-error")}>
                {errores.consentimiento}
              </p>
            ) : null}
          </div>

          <div className="pod-trampa" aria-hidden="true">
            <label htmlFor={identificadorDe("trampa")}>No rellenes este campo</label>
            <input
              id={identificadorDe("trampa")}
              name={CAMPO_TRAMPA}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={valores.trampa}
              onChange={(evento) => cambiarTexto("trampa", evento.target.value)}
            />
          </div>

          <button type="submit" className="pod-boton pod-formulario__envio" disabled={seEstaEnviando}>
            {seEstaEnviando ? TEXTO_MIENTRAS_SE_ENVIA : textoDeEnvio}
          </button>
        </form>
      )}
    </div>
  );
}
