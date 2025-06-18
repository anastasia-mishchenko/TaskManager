export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  return new Date(dateString).toLocaleDateString();
};

export const isDueSoon = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate < today;
};