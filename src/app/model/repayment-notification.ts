export interface RepaymentNotification {
  id: number;
  uuid: string;
  type: 'UPCOMING' | 'OVERDUE' | 'REMINDER';
  status: 'PENDING' | 'READ' | 'DISMISSED';
  title: string;
  message: string;
  repaymentDueDate: Date | string;
  amount: number;
  readAt?: Date | string;
  daysOverdue?: number;
  mandate?: any;
  owner?: any;
  agency?: any;
  user?: any;
  repayment?: any;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NotificationStats {
  unread_count: number;
  overdue_count: number;
  total_overdue_amount: number;
}
