const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiEndpoints = {
  videos: `${API_URL}/api/videos`,
  video: {
    view: (id: number) => `${API_URL}/api/videos/${id}/view`,
    delete: (id: number) => `${API_URL}/api/videos/${id}`,
  },
  outputs: (filename: string) => `${API_URL}/outputs/${filename}`,
}
