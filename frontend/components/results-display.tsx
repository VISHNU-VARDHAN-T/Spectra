"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, MonitorSmartphone, HardDrive, Cable, Laptop, Server, Code, Database, Cloud, Settings, FileCode, Shield } from "lucide-react"

export interface Requirement {
  id: string
  text: string
  category: "hardware" | "software"
  subCategory: string
  confidence: number
}

interface ResultsDisplayProps {
  requirements: Requirement[]
}

const hardwareIcons: Record<string, React.ElementType> = {
  "Processor/CPU": Cpu,
  "Memory/RAM": HardDrive,
  "Storage": HardDrive,
  "Network": Cable,
  "Display": MonitorSmartphone,
  "Peripheral": Laptop,
  "Server": Server,
  "General Hardware": Cpu,
}

const softwareIcons: Record<string, React.ElementType> = {
  "Operating System": Settings,
  "Database": Database,
  "Programming Language": FileCode,
  "Framework": Code,
  "Cloud Service": Cloud,
  "Security": Shield,
  "Application": Code,
  "General Software": Code,
}

export function ResultsDisplay({ requirements }: ResultsDisplayProps) {
  const hardwareReqs = requirements.filter(r => r.category === "hardware")
  const softwareReqs = requirements.filter(r => r.category === "software")

  const getIcon = (category: string, subCategory: string) => {
    if (category === "hardware") {
      const Icon = hardwareIcons[subCategory] || Cpu
      return <Icon className="w-4 h-4" />
    }
    const Icon = softwareIcons[subCategory] || Code
    return <Icon className="w-4 h-4" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-chart-3 text-card"
    if (confidence >= 0.6) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hardware Requirements */}
      <Card className="border-2 border-chart-1/30">
        <CardHeader className="bg-chart-1/10 border-b border-chart-1/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-chart-1 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-card" />
            </div>
            <span className="text-foreground">Hardware Requirements</span>
            <Badge variant="secondary" className="ml-auto">
              {hardwareReqs.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 max-h-[400px] overflow-y-auto">
          {hardwareReqs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No hardware requirements detected
            </p>
          ) : (
            <div className="space-y-3">
              {hardwareReqs.map((req) => (
                <div 
                  key={req.id} 
                  className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-chart-1/10 flex items-center justify-center shrink-0">
                      {getIcon(req.category, req.subCategory)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">{req.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {req.subCategory}
                        </Badge>
                        <Badge className={`text-xs ${getConfidenceColor(req.confidence)}`}>
                          {Math.round(req.confidence * 100)}% confident
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Software Requirements */}
      <Card className="border-2 border-chart-3/30">
        <CardHeader className="bg-chart-3/10 border-b border-chart-3/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-chart-3 flex items-center justify-center">
              <Code className="w-4 h-4 text-card" />
            </div>
            <span className="text-foreground">Software Requirements</span>
            <Badge variant="secondary" className="ml-auto">
              {softwareReqs.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 max-h-[400px] overflow-y-auto">
          {softwareReqs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No software requirements detected
            </p>
          ) : (
            <div className="space-y-3">
              {softwareReqs.map((req) => (
                <div 
                  key={req.id} 
                  className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-chart-3/10 flex items-center justify-center shrink-0">
                      {getIcon(req.category, req.subCategory)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">{req.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {req.subCategory}
                        </Badge>
                        <Badge className={`text-xs ${getConfidenceColor(req.confidence)}`}>
                          {Math.round(req.confidence * 100)}% confident
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
