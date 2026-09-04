// id, nombre, categoría, kcal, proteína, hidratos, azúcares, grasas, grasas insaturadas, fibra, alérgenos, conversiones (a gramos)
// Vive aparte para que las dos tablas de alimentos puedan usarlo sin importarse entre sí.
export const I = (id, n, cat, kcal, p, c, az, g, gs, f, al = [], cv = {}) => ({ id, n, cat, kcal, p, c, az, g, gs, f, al, cv });
