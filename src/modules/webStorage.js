const storageKey = "composed_todo_app_data";

export const storage = {
  save: (projectsArray) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(projectsArray));
    } catch (error) {
      console.error("failed to write to localstoreage : ", error);
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("failed to read from localStorage : ", error);
      return [];
    }
  },
};
