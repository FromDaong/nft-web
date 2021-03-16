export const MathUtil = {

  randomFloatInRange: (min: number, max: number) => {
    return min + (Math.random() * (max - min))
  },
  
}