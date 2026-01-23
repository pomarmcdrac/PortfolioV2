import { Project } from "@/data/projects";
import { ExperienceItem } from "@/data/experience";

// Determinar la URL base: En servidor usa API_URL real, en cliente usa el Proxy
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.API_URL || "";
  }
  return "/api/proxy";
};

const AUTH_URL = "/api/auth/login";

/**
 * Helper to extract data from the 'result' field of the API response if it exists.
 */
function extractResult(data: any): any {
  if (data && typeof data === "object" && "result" in data) {
    return data.result;
  }
  return data;
}

/**
 * Fetches all projects from the API.
 */
export async function getProjects(lang?: string): Promise<Project[]> {
  const baseUrl = getBaseUrl();
  try {
    let url = `${baseUrl}/projects`;
    if (lang) {
      url += `?lang=${encodeURIComponent(lang.toLowerCase())}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { ...getAuthHeader() },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const rawData = await response.json();
    const data = extractResult(rawData);

    // Mapeo de campos: de 'technologies' (API) a 'techStack' (Local)
    return (Array.isArray(data) ? data : []).map((p: any) => ({
      ...p,
      techStack: p.technologies || [],
      repoUrl: p.githubUrl,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

/**
 * Fetches all experience items from the API.
 */
export async function getExperience(lang?: string): Promise<ExperienceItem[]> {
  const baseUrl = getBaseUrl();
  try {
    let url = `${baseUrl}/experience`;
    if (lang) {
      url += `?lang=${encodeURIComponent(lang.toLowerCase())}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { ...getAuthHeader() },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch experience");
    }

    const rawData = await response.json();
    const data = extractResult(rawData);

    // Mapeo de campos: de 'position' (API) a 'role' (Local)
    return (Array.isArray(data) ? data : []).map((e: any) => ({
      ...e,
      role: e.position,
      period: `${e.startDate} - ${e.current ? "Presente" : e.endDate}`,
    }));
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
}

/**
 * Create a new experience item
 */
export async function createExperience(experienceData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(experienceData),
    });

    return response.ok;
  } catch (error) {
    console.error("Create experience error:", error);
    return false;
  }
}

/**
 * Update an experience item
 */
export async function updateExperience(
  id: string,
  experienceData: any,
): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/experience/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(experienceData),
    });

    return response.ok;
  } catch (error) {
    console.error("Update experience error:", error);
    return false;
  }
}

/**
 * Delete an experience item
 */
export async function deleteExperience(id: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/experience/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    return response.ok;
  } catch (error) {
    console.error("Delete experience error:", error);
    return false;
  }
}

/**
 * Fetches a single project by ID.
 */
export async function getProjectById(
  id: string,
  lang?: string,
): Promise<Project | null> {
  const baseUrl = getBaseUrl();
  try {
    let url = `${baseUrl}/projects/${id}`;
    if (lang) {
      url += `?lang=${encodeURIComponent(lang.toLowerCase())}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { ...getAuthHeader() },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch project");
    }

    const rawData = await response.json();
    const p = extractResult(rawData);

    // Mapeo de campos
    return {
      ...p,
      techStack: p.technologies || [],
      repoUrl: p.githubUrl,
    };
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches all skills from the API.
 */
export async function getSkills(): Promise<string[]> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/skills`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Failed to fetch skills");

    const rawData = await response.json();
    const data = extractResult(rawData);
    return (Array.isArray(data) ? data : []).map((s: any) => s.name || s);
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}

/**
 * Fetches all skills with full data (for admin)
 */
export async function getSkillsFull(): Promise<any[]> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/skills`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch skills");
    const rawData = await response.json();
    return extractResult(rawData) || [];
  } catch (error) {
    console.error("Error fetching full skills:", error);
    return [];
  }
}

/**
 * Fetches about information from the API.
 */
export async function getAbout(lang?: string): Promise<any> {
  const baseUrl = getBaseUrl();
  try {
    let url = `${baseUrl}/about`;
    if (lang) {
      url += `?lang=${encodeURIComponent(lang.toLowerCase())}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { ...getAuthHeader() },
    });

    if (!response.ok) throw new Error("Failed to fetch about info");

    const rawData = await response.json();
    return extractResult(rawData);
  } catch (error) {
    console.error("Error fetching about info:", error);
    return null;
  }
}

/**
 * Update about information
 */
export async function updateAbout(aboutData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/about`, {
      method: "POST", // Using POST for about update as it acts like Upsert
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(aboutData),
    });

    return response.ok;
  } catch (error) {
    console.error("Update about error:", error);
    return false;
  }
}

/**
 * Sends a contact email.
 */
export async function sendEmail(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    // Ensure default subject if not provided
    const payload = {
      ...data,
      subject: data.subject || "Nuevo mensaje desde Porfolio V2",
    };

    const response = await fetch(`${baseUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to send email");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

/**
 * Helper to get the auth token from local storage
 */
const getAuthHeader = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  const lang = localStorage.getItem("language") || "es";

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Accept-Language": lang.toLowerCase(),
  };
};

/**
 * Login tracking local state for error messages
 */
export async function login(
  email: string,
  password: string,
): Promise<string | null> {
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.error || data.message || `Error ${response.status}: Login failed`;
      throw new Error(errorMsg);
    }

    const token = data.token || data.access_token || data;
    if (typeof token === "string") {
      localStorage.setItem("auth_token", token);
      return token;
    }
    return null;
  } catch (error: any) {
    console.error("Login error:", error);
    // We throw the error so the UI can show the rate limit message
    throw error;
  }
}

/**
 * Upload an image to the API
 */
export async function uploadImage(file: File): Promise<string | null> {
  const baseUrl = getBaseUrl();
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/upload/image`, {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const rawData = await response.json();
    const data = extractResult(rawData);
    return data.url || data.secure_url || data;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

/**
 * Create a new project
 */
export async function createProject(projectData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });

    return response.ok;
  } catch (error) {
    console.error("Create project error:", error);
    return false;
  }
}

/**
 * Update a project
 */
export async function updateProject(
  id: string,
  projectData: any,
): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });

    return response.ok;
  } catch (error) {
    console.error("Update project error:", error);
    return false;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/projects/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    return response.ok;
  } catch (error) {
    console.error("Delete project error:", error);
    return false;
  }
}

/**
 * Create a new skill
 */
export async function createSkill(skillData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(skillData),
    });

    return response.ok;
  } catch (error) {
    console.error("Create skill error:", error);
    return false;
  }
}

/**
 * Update a skill
 */
export async function updateSkill(
  id: string,
  skillData: any,
): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/skills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(skillData),
    });

    return response.ok;
  } catch (error) {
    console.error("Update skill error:", error);
    return false;
  }
}

/**
 * Delete a skill
 */
export async function deleteSkill(id: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/skills/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    return response.ok;
  } catch (error) {
    console.error("Delete skill error:", error);
    return false;
  }
}

/**
 * Fetch all blogs
 */
export async function getBlogs(lang?: string): Promise<any[]> {
  const baseUrl = getBaseUrl();
  try {
    let url = `${baseUrl}/blogs`;
    if (lang) {
      url += `?lang=${encodeURIComponent(lang.toLowerCase())}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { ...getAuthHeader() },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      console.warn("Failed to fetch blogs:", response.statusText);
      return [];
    }
    const rawData = await response.json();
    const data = extractResult(rawData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

/**
 * Create a new blog post
 */
export async function createBlog(blogData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(blogData),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Update a blog post
 */
export async function updateBlog(id: string, blogData: any): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(blogData),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlog(id: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/blogs/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: any): Promise<any> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/booking/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookingData),
    });

    const rawData = await response.json();
    if (!response.ok) {
      console.error("Create booking error:", rawData);
      return null;
    }
    return extractResult(rawData);
  } catch (error) {
    console.error("Create booking error:", error);
    return null;
  }
}

/**
 * Confirm a booking with a token
 */
export async function confirmBooking(token: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(
      `${baseUrl}/booking/bookings/confirm?token=${token}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeader(),
        },
      },
    );

    return response.ok;
  } catch (error) {
    console.error("Confirm booking error:", error);
    return false;
  }
}

/**
 * Fetch available slots for a specific date
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(
      `${baseUrl}/booking/bookings/available-slots?date=${date}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      },
    );

    if (!response.ok) return [];

    const rawData = await response.json();
    const data = extractResult(rawData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching slots:", error);
    return [];
  }
}
