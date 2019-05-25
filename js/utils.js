
const truncateTextlength = (text, length) => {
  if (length < 0 || !text) return '';

  const truncatedText = text.length > length
    ? `${text.substring(0, length - 3)}...`
    : text;

  return truncatedText;
};

const formatDate = (dateString) => {
  if (!dateString) return null;

  // Format: HH:mm dd/MM/yyyy
  const date = new Date(dateString);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();

  return `${hour}:${minute} ${day}/${month}/${year}`;
};

const utils = {
  truncateTextlength,
  formatDate,
};
export default utils;
