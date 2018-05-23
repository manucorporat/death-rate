
export function reduce(i,
    volcanes, corrimientos, inundaciones, terremotos, sequias, ciclones,
    malnutricion, mortalidad
  ) {
    return (
      (0.9*volcanes[i] +
      1.2*corrimientos[i] +
      1.4*inundaciones[i] +
      1.6*terremotos[i] +
      1.3*sequias[i] +
      1.5*ciclones[i] +
  
      malnutricion[i] +
      1.1*mortalidad[i] 
    )/0.1);
  }
