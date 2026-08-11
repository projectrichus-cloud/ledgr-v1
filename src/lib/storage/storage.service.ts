import { createClient } from "@/lib/supabase/server";

export class StorageService {
  async downloadDocument(path: string): Promise<Buffer> {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .download(path);

    if (error) {
      throw error;
    }

    const arrayBuffer = await data.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }
}