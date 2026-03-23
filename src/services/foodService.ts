import type { FoodItem } from '../types'
import { get, post } from './api'

export const logMeal = (foods: any) => post('/foods', foods)
export const getTodayLog = () => get('/foods/today')
export const getDailySummary = () => get('/summary/today')
export const parseMeal = (text: string) => post('/foods/parse', { text })

export const test = async () => {
  const res = await get('/')
  console.log('API Test:', res)
}