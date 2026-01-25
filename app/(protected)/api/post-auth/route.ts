import { createClient } from "@/utils/supabase/server";

export async function POST(){
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return Response.json({error: "Unauthorized"}, {status: 401});


    // Check for profile, if not exist create new profile
    const {data: existingProfile} = await supabase.from("user_profiles").select("id").eq("id", user.id).single();

    if (!existingProfile) {
        await supabase.from("user_profiles").insert({
            id: user.id,
            display_name: user.user_metadata.full_name ?? "User",
        });
    }

    // Check for saving data, if not exist create new saving data
    const {data: existingSaving} = await supabase.from("user_savings").select("id").eq("user_id", user.id);
    
    if (!existingSaving || existingSaving.length === 0) {
        await supabase.from("user_savings").insert([
            {user_id: user.id, name: "cash", balance: 0},
            {user_id: user.id, name: "card", balance: 0},
        ]);
    }

    return Response.json({success: true});
}