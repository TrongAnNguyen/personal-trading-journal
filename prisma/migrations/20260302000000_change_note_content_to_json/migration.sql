/*
  Warnings:

  - Changed the type of `content` on the `notes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
*/

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "content" TYPE JSONB USING 
CASE 
    WHEN "content" IS NULL THEN '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb
    WHEN "content" = '' THEN '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb
    WHEN "content" LIKE '{%' OR "content" LIKE '[%' THEN "content"::jsonb
    ELSE jsonb_build_object(
        'type', 'doc',
        'content', jsonb_build_array(
            jsonb_build_object(
                'type', 'paragraph',
                'content', jsonb_build_array(
                    jsonb_build_object(
                        'type', 'text',
                        'text', "content"
                    )
                )
            )
        )
    )
END;
