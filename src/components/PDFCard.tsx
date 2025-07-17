import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFCardProps {
  title: string;
  filename: string;
  onView: () => void;
}

export const PDFCard = ({ title, filename, onView }: PDFCardProps) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] bg-document-bg border-document-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground group-hover:text-document-hover transition-colors mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {filename}.pdf
              </p>
            </div>
          </div>
          <Button
            onClick={onView}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};