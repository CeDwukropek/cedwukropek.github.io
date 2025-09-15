const colorMap = {
  White: "#cfcfcf",
  Black: "#535353",
  Red: "#c7404b",
  Blue: "#2f39c2",
  Green: "#00FF00",
  Yellow: "#e6e659",
  Orange: "#f5b43b",
  Gray: "#808080",
};

export function stringToColor(str) {
  return (
    colorMap[str] ||
    "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
  );
}
