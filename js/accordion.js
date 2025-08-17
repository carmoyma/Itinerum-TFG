function toggleAccordion(id) {
  const content = document.getElementById(id);
  if (content.classList.contains("max-h-0")) {
    content.classList.remove("max-h-0", "opacity-0");
    content.classList.add("max-h-96", "opacity-100");
  } else {
    content.classList.remove("max-h-96", "opacity-100");
    content.classList.add("max-h-0", "opacity-0");
  }
}
