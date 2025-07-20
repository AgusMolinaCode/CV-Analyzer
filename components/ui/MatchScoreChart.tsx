"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface MatchScoreChartProps {
  matchScore: number;
  candidateName: string;
  compact?: boolean;
}

const chartConfig = {
  score: {
    label: "Match Score",
  },
  match: {
    label: "Match",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function MatchScoreChart({
  matchScore,
  candidateName,
  compact = false,
}: MatchScoreChartProps) {
  // Calculate the chart data based on match score
  const chartData = [
    {
      category: "match",
      score: matchScore,
      fill: getScoreColor(matchScore),
    },
  ];

  // Determine color based on score
  function getScoreColor(score: number): string {
    if (score >= 80) return "hsl(142, 76%, 36%)"; // Green
    if (score >= 60) return "hsl(47, 96%, 53%)"; // Yellow
    if (score >= 40) return "hsl(25, 95%, 53%)"; // Orange
    return "hsl(0, 84%, 60%)"; // Red
  }

  // Calculate angle based on score (0-100 maps to 0-270 degrees)
  const endAngle = (matchScore / 100) * 270;

  // Determine trend text and icon
  const getTrendInfo = (score: number) => {
    if (score >= 80) {
      return {
        text: "Excelente match para el puesto",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-600",
      };
    }
    if (score >= 60) {
      return {
        text: "Buen candidato para considerar",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-yellow-600",
      };
    }
    if (score >= 40) {
      return {
        text: "Candidato promedio",
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-orange-600",
      };
    }
    return {
      text: "Match bajo para el puesto",
      icon: <TrendingDown className="h-4 w-4" />,
      color: "text-red-600",
    };
  };

  const trendInfo = getTrendInfo(matchScore);

  if (compact) {
    return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={endAngle}
          innerRadius={25}
          outerRadius={40}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[30, 20]}
          />
          <RadialBar dataKey="score" background cornerRadius={5} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-lg font-bold"
                      >
                        {chartData[0].score}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Match Score</CardTitle>
        <CardDescription>{candidateName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="score" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].score}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div
          className={`flex items-center gap-2 leading-none font-medium ${trendInfo.color}`}
        >
          {trendInfo.text} {trendInfo.icon}
        </div>
        <div className="text-muted-foreground leading-none">
          Basado en análisis de CV con IA
        </div>
      </CardFooter>
    </Card>
  );
}
