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
  Unpaid: 'warn',
  Pending: 'orange',
  Accepted: 'primary',
  Rejected: 'error',
  [ORDER_STATUS.DriverAssigned]: 'cyan',
  [ORDER_STATUS.InProgress]: 'orange',
  [ORDER_STATUS.InTransit]: 'orange',
  Delivered: 'success',
}

export const ORDER_PENDING_STATUS = [
  ORDER_STATUS.Accepted,
  ORDER_STATUS.InProgress,
  ORDER_STATUS.DriverAssigned,
  ORDER_STATUS.InTransit,
]
