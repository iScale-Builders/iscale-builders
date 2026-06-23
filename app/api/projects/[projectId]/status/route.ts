import { NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { project as projectTable } from "@/drizzle/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = (await params).projectId

    // Récupérer la chaîne
    const [projectData] = await db
      .select({
        id: projectTable.id,
        slug: projectTable.slug,
        status: projectTable.launchStatus,
        createdBy: projectTable.createdBy,
      })
      .from(projectTable)
      .where(eq(projectTable.id, projectId))

    if (!projectData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Vérifier que l'utilisateur est le propriétaire de la chaîne
    if (projectData.createdBy !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      id: projectData.id,
      slug: projectData.slug,
      status: projectData.status,
    })
  } catch (error) {
    console.error("Error fetching project status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
