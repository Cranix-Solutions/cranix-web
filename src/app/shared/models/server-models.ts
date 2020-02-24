
/**
 * Thes session modell
 * @description The object recived if the login was succesfull.
 */
export interface UserResponse {
  userId: number,
  token: string,
  mac: string,
  name: string,
  role: string,
  dnsname: string,
  roomId: string,
  roomName?: string,
  instituteName?: string,
  mustChange: boolean,
  commonName: string,
  acls: string[]
}

/**
 * The LoginForm intefrace 
 * @description variables used to login  
 */
export interface LoginForm {
  username: string,
  password: string,
}

export interface ServerResponse {
        id: number,
        code: string,
        value: string,
        sessionId: number,
        objectId: number,
        parameters: string[]

}

export const TOKEN = 'cranix-token';
