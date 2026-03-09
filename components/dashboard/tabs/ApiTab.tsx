"use client";

import type { DashboardData } from "@/lib/type";
import ApiKeyPanel from "../ApiKeyPanel";

interface ApiTabProps {
  data: DashboardData;
}

export default function ApiTab({ data }: ApiTabProps) {
  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-dash-text m-0">
          API Access & Data Uploads
        </h2>
        <p className="font-sans text-[13px] text-dash-text-secondary mt-1">
          Manage your API key and monitor incoming data coverage for Mill {data.mill_id}
        </p>
      </div>
      <ApiKeyPanel
        apiKey={data.api_key}
        uploadCount={data.upload_count_7d}
        lastUpload={data.last_upload}
      />
    </div>
  );
}