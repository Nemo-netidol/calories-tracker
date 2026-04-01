import { get, post, del } from './api'

export const logMeal = (foods: any) => post('/foods', foods)
export const getTodayLog = () => get('/foods')
export const getDailySummary = () => get('/summary/today')
export const parseMeal = (text: string) => post('/foods/parse', { text })
export const deleteFood = (id: string) => del(`/foods/${id}`)

// Auth Services
export const loginUser = (password: string) => post('/auth/login', { password })
export const checkAuth = () => get('/auth/check')
export const logoutUser = () => post('/auth/logout', {})

export const test = async () => {
  const res = await get('/')
  console.log('API Test:', res)
}