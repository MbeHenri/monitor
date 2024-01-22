export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function format_ratio_2_per(per, a = 2, b = 2) {
  return Math.trunc(per * Math.pow(10, a + b)) * Math.pow(10, -a);
}
