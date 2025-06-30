export interface IUserData {
  id: number;
  name: string;
  username: string;
  picture: string;
  email: string;
  role: string | null;
  project: string | null;
  projectId: number | null;
}