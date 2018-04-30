
export function reduce(i,
    volcanes, corrimientos, inundaciones, terremotos, sequias, ciclones,
    malnutricion, mortalidad
  ) {
    return (
      (volcanes[i] +
      corrimientos[i] +
      inundaciones[i] +
      terremotos[i] +
      sequias[i] +
      ciclones[i] +
  
      malnutricion[i] +
      mortalidad[i] 
    )/0.08);
  }
