// Smooth scroll utility function
export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Smooth scroll to element by ID
export const smoothScrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Enhanced smooth scroll with offset for fixed headers
export const smoothScrollToElementWithOffset = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};