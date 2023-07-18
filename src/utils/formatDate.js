export function formatDate(inputDate) {
  const dateObj = new Date(inputDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Agregamos +1 ya que los meses son indexados desde 0
  const year = dateObj.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
