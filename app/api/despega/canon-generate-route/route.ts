import { createClient } from '@/lib/supabase/server'
import { CANON_RULES, evaluateRules } from '@/lib/canon-rules-engine'
import { generateRoute30Days } from '@/lib/canon-routes-generator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return Response.json({ error: 'user_id required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Get C2-Paso1 responses
    const { data: c2Responses, error: c2Error } = await supabase
      .from('canon_conozcamonos_2_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('paso', 1)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (c2Error || !c2Responses) {
      console.error('[v0] Error fetching C2 responses:', c2Error)
      return Response.json({ error: 'C2 responses not found' }, { status: 404 })
    }

    // 2. Evaluate rules to get actions
    const actions = evaluateRules(CANON_RULES, c2Responses.responses || {})
    console.log('[v0] Evaluated rules, got', actions.length, 'actions')

    // 3. Generate 30-day route
    const route30 = generateRoute30Days(actions, c2Responses.responses || {})

    // 4. Check if route already exists for this user+cycle
    const { data: existingRoute } = await supabase
      .from('canon_generated_routes')
      .select('id')
      .eq('user_id', user_id)
      .eq('phase', 30)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let routeId: string

    if (existingRoute) {
      // Update existing route
      const { data: updated, error: updateError } = await supabase
        .from('canon_generated_routes')
        .update({
          route_data: route30,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRoute.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('[v0] Error updating route:', updateError)
        return Response.json({ error: 'Failed to update route' }, { status: 500 })
      }

      routeId = updated.id
    } else {
      // Insert new route
      const { data: inserted, error: insertError } = await supabase
        .from('canon_generated_routes')
        .insert({
          user_id,
          phase: 30,
          route_data: route30,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('[v0] Error inserting route:', insertError)
        return Response.json({ error: 'Failed to insert route' }, { status: 500 })
      }

      routeId = inserted.id
    }

    // 5. Create trazability entries for each action
    const trazabilityEntries = actions.flatMap((action) => ({
      user_id,
      route_id: routeId,
      action_id: action.id,
      action_title: action.title,
      source_response_ids: action.trazability_source_response_ids,
      source_response_text: JSON.stringify(action.trazability_source_response_ids.map(id => c2Responses.responses?.[id] || 'N/A')),
      created_at: new Date().toISOString(),
    }))

    if (trazabilityEntries.length > 0) {
      const { error: trazError } = await supabase
        .from('canon_user_journey_trazability')
        .insert(trazabilityEntries)

      if (trazError) {
        console.error('[v0] Error inserting trazability:', trazError)
        // Don't fail on trazability error - route is already saved
      }
    }

    console.log('[v0] Route generated successfully for user', user_id)

    return Response.json({
      success: true,
      route_id: routeId,
      actions_count: actions.length,
      route: route30,
    })
  } catch (error) {
    console.error('[v0] Error in canon-generate-route:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
