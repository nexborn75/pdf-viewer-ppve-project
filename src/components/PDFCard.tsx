import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFCardProps {
  title: string;
  filename: string;
  onView: () => void;
  onDownload: () => void;
}

export const PDFCard = ({ title, filename, onView, onDownload }: PDFCardProps) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] bg-document-bg border-document-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground group-hover:text-document-hover transition-colors mb-1 line-clamp-2 leading-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate mb-3">
                {filename}.pdf
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={onView}
                  size="sm"
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  Consulter
                </Button>
                <Button
                  onClick={onDownload}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};