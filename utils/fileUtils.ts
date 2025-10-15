
export const fileToBase64 = (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Invalid file type. Please upload a valid image file (e.g., JPEG, PNG).'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(new Error('There was an issue reading the file. It may be corrupted.'));
  });
};
