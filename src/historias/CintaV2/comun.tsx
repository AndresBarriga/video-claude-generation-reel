// E64 v4 «Cómo chapar: 3 errores». Reutiliza la vía, el reparto y los primeros planos de `../Cinta` (v1c); aquí solo lo nuevo.
export * from "../Cinta/comun";
export { CintaF, ParedCerca, CuerdaM, Chapa, abajoDe } from "../Cinta/Macro";
export { Rot, Flecha } from "../Cinta/Bien";
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
