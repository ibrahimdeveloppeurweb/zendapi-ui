export enum ValidatorsEnums {
  email = "[a-z-0-9_.+-,;]+@[a-z-0-9-]+[.a-z]*",
  name = "^[a-zA-Z-0-9\\s-àâçéèêëîïôùûüœÀÂÇÉÈÊËÎÏÔÙÛÜ_-]*$",
  number = "^[0-9\\s]*$",
  decimal = "^[0-9]+([.,][0-9]+)?$",
  unsignedNumber = "^-?[0-9]\\d*(\\.\\d+)?$"
}
