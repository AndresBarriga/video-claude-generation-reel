// E69 «Pump: no estás flojo» (formato de las referencias). Reutiliza el antebrazo, el corte y la pared de `../Pump` (E43); aquí solo lo nuevo.
export * from "../Pump/comun";
export { Brazo } from "../Pump/Brazo";
export { Corte } from "../Pump/Corte";
export { Vig, Zoom } from "../Pump/Gym";
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
