import AppLoading from "@/components/AppLoading";
import { db } from "@/db/db";
import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { useEffect } from "react";

export default function DbMigrator({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { showMessage } = useModalMessage();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) {
      // showMessage(
      //   `Error occured while running local DB migrations. Please delete and download app again =). Error logs: ${error.message}`
      // );
    }
  }, [error]);

  // Migration is in progress
  if (!success) {
    return <AppLoading />;
  }

  if (error) {
    return <AppLoading />;
  }

  return children;
}
