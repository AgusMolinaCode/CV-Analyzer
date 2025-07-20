import { supabase } from './supabase'
import type { Candidates } from './interfaces'

// Fetch all CVs for a specific user
export const fetchUserCVs = async (clerkId: string): Promise<Candidates[]> => {
  const { data, error } = await supabase
    .from('cv_analysis')
    .select('*')
    .eq('clerk_id', clerkId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching CVs:', error)
    return []
  }
  
  return data || []
}

// Fetch a single CV by ID
export const fetchCVById = async (id: string): Promise<Candidates | null> => {
  const { data, error } = await supabase
    .from('cv_analysis')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching CV by ID:', error)
    return null
  }
  
  return data
}

// Update CV status
export const updateCVStatus = async (id: string, estado: string): Promise<boolean> => {
  
  const { error } = await supabase
    .from('cv_analysis')
    .update({ estado_del_proceso: estado })
    .eq('id', id)
    .select()
    
  if (error) {
    console.error('Error updating CV status:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return false
  }
  return true
}

// Delete CV by ID
export const deleteCVById = async (id: string): Promise<boolean> => {
  
  const { error } = await supabase
    .from('cv_analysis')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('Error deleting CV:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return false
  }
  
  return true
}

// Get all unique stack technologies from candidates
export const getUniqueStackTechnologies = async (clerkId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('cv_analysis')
    .select('stack_principal')
    .eq('clerk_id', clerkId)
    
  if (error) {
    console.error('Error fetching stack technologies:', error)
    return []
  }
  
  const allStacks = data?.flatMap(candidate => candidate.stack_principal || []) || []
  const uniqueStacks = [...new Set(allStacks)].sort()
  
  return uniqueStacks
}