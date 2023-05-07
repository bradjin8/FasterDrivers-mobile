export const ORDER_STATUS = {
  Unpaid: "Unpaid",
  Pending: "Pending",
  Accepted: "Accepted",
  Rejected: "Rejected",
  InProgress: "In Progress",
  DriverAssigned: "Driver Assigned",
  InTransit: "In Transit",
  Delivered: "Delivered",
}

export const ORDER_STATUS_COLOR = {
  Unpaid: "red",
  Pending: "orange",
  Accepted: "blue",
  Rejected: "red",
  InProgress: "blue",
  InTransit: "blue",
  Delivered: "green",
}

export const ORDER_PENDING_STATUS = [
  ORDER_STATUS.Accepted,
  ORDER_STATUS.InProgress,
  ORDER_STATUS.DriverAssigned,
  ORDER_STATUS.InTransit,
]

