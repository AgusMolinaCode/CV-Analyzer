"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import type { Candidates } from "@/lib/interfaces"

interface CustomMatchScoreProps {
  candidate: Candidates;
  compact?: boolean;
}

const chartConfig = {
  score: {
    label: "Custom Match Score",
  },
  match: {
    label: "Match",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

// Algoritmo matemático detallado para calcular match score
function calculateCustomMatchScore(candidate: Candidates): {
  score: number;
  breakdown: {
    technicalSkills: number;
    experience: number;
    seniority: number;
    qualifications: number;
    matchDetails: number;
    skillsDistribution: number;
  };
} {
  let totalScore = 0;
  const breakdown = {
    technicalSkills: 0,
    experience: 0,
    seniority: 0,
    qualifications: 0,
    matchDetails: 0,
    skillsDistribution: 0,
  };

  // 1. Technical Skills Assessment (35% weight)
  const technicalWeight = 0.35;
  let technicalScore = 0;
  
  // Stack principal evaluation
  const stackCount = candidate.stack_principal?.length || 0;
  const stackScore = Math.min(stackCount * 8, 80); // Max 80 points for stack
  
  // Programming languages evaluation
  const languagesCount = candidate.lenguajes_programacion?.length || 0;
  const languagesScore = Math.min(languagesCount * 6, 60); // Max 60 points
  
  // Frameworks evaluation
  const frameworksCount = candidate.frameworks_principales?.length || 0;
  const frameworksScore = Math.min(frameworksCount * 5, 50); // Max 50 points
  
  // DevOps tools evaluation
  const devopsCount = candidate.herramientas_devops?.length || 0;
  const devopsScore = Math.min(devopsCount * 4, 40); // Max 40 points
  
  technicalScore = (stackScore + languagesScore + frameworksScore + devopsScore) / 2.3;
  breakdown.technicalSkills = Math.min(technicalScore * technicalWeight, 35);
  totalScore += breakdown.technicalSkills;

  // 2. Experience Assessment (25% weight)
  const yearsExperience = candidate.anos_experiencia || 0;
  
  // Non-linear experience scoring (diminishing returns after 8 years)
  let experienceScore = 0;
  if (yearsExperience <= 2) {
    experienceScore = yearsExperience * 30; // 0-60 points
  } else if (yearsExperience <= 5) {
    experienceScore = 60 + (yearsExperience - 2) * 20; // 60-120 points
  } else if (yearsExperience <= 8) {
    experienceScore = 120 + (yearsExperience - 5) * 15; // 120-165 points
  } else {
    experienceScore = 165 + (yearsExperience - 8) * 5; // 165+ points (diminishing)
  }
  
  experienceScore = Math.min(experienceScore, 200);
  breakdown.experience = Math.min((experienceScore / 200) * 25, 25);
  totalScore += breakdown.experience;

  // 3. Seniority Level Assessment (20% weight)
  const seniorityMap: { [key: string]: number } = {
    'junior': 60,
    'semi-senior': 75,
    'semi senior': 75,
    'mid': 75,
    'senior': 90,
    'lead': 100,
    'tech lead': 100,
    'principal': 100,
  };
  
  const seniorityLevel = candidate.nivel_seniority?.toLowerCase() || 'junior';
  const seniorityScore = seniorityMap[seniorityLevel] || 50;
  breakdown.seniority = (seniorityScore / 100) * 20;
  totalScore += breakdown.seniority;

  // 4. Qualifications Assessment (10% weight)
  let qualificationsScore = 0;
  
  // English level
  const englishLevel = candidate.english_level?.toLowerCase() || 'basic';
  const englishMap: { [key: string]: number } = {
    'basic': 30,
    'intermediate': 60,
    'advanced': 85,
    'native': 100,
    'fluent': 100,
  };
  qualificationsScore += englishMap[englishLevel] || 30;
  
  // Certifications
  const certificationsCount = candidate.certificaciones?.length || 0;
  qualificationsScore += Math.min(certificationsCount * 15, 60);
  
  // Education background
  if (candidate.educacion && candidate.educacion.length > 0) {
    qualificationsScore += 40;
  }
  
  qualificationsScore = Math.min(qualificationsScore, 200);
  breakdown.qualifications = (qualificationsScore / 200) * 10;
  totalScore += breakdown.qualifications;

  // 5. Match Details Assessment (5% weight)
  let matchDetailsScore = 0;
  
  if (candidate.match_details) {
    const details = candidate.match_details;
    if (details.stack_requerido) matchDetailsScore += 25;
    if (details.experiencia_minima) matchDetailsScore += 25;
    if (details.nivel_ingles) matchDetailsScore += 20;
    if (details.liderazgo) matchDetailsScore += 15;
    if (details.certificaciones_relevantes) matchDetailsScore += 15;
  }
  
  breakdown.matchDetails = (matchDetailsScore / 100) * 5;
  totalScore += breakdown.matchDetails;

  // 6. Skills Distribution Assessment (5% weight)
  let skillsDistScore = 0;
  
  if (candidate.distribucion_skills) {
    const dist = candidate.distribucion_skills;
    
    // Reward balanced skill distribution
    const skillsVariance = Math.abs(20 - (dist.backend || 0)) + 
                          Math.abs(20 - (dist.frontend || 0)) + 
                          Math.abs(20 - (dist.data || 0)) + 
                          Math.abs(20 - (dist.devops || 0)) + 
                          Math.abs(20 - (dist.gestión || 0));
    
    skillsDistScore = Math.max(0, 100 - (skillsVariance * 2));
  }
  
  breakdown.skillsDistribution = (skillsDistScore / 100) * 5;
  totalScore += breakdown.skillsDistribution;

  // Apply qualification bonus/penalty
  if (candidate.is_qualified) {
    totalScore *= 1.1; // 10% bonus for qualified candidates
  } else {
    totalScore *= 0.8; // 20% penalty for non-qualified candidates
  }

  // Ensure score is within 0-100 range
  const finalScore = Math.max(0, Math.min(100, totalScore));

  return {
    score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
    breakdown
  };
}

export function CustomMatchScore({ candidate, compact = false }: CustomMatchScoreProps) {
  const { score: customScore, breakdown } = calculateCustomMatchScore(candidate);
  
  // Calculate the chart data based on custom score
  const chartData = [
    { 
      category: "match", 
      score: customScore, 
      fill: getScoreColor(customScore)
    },
  ];

  // Determine color based on score
  function getScoreColor(score: number): string {
    if (score >= 85) return "hsl(142, 76%, 36%)"; // Dark Green
    if (score >= 75) return "hsl(120, 60%, 50%)"; // Green
    if (score >= 65) return "hsl(47, 96%, 53%)"; // Yellow
    if (score >= 50) return "hsl(25, 95%, 53%)"; // Orange
    if (score >= 35) return "hsl(15, 85%, 55%)"; // Red-Orange
    return "hsl(0, 84%, 60%)"; // Red
  }

  // Calculate angle based on score (0-100 maps to 0-270 degrees)
  const endAngle = (customScore / 100) * 270;

  // Determine trend text and icon
  const getTrendInfo = (score: number) => {
    if (score >= 85) {
      return {
        text: "Candidato excepcional - Match perfecto",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-700"
      }
    }
    if (score >= 75) {
      return {
        text: "Excelente candidato - Altamente recomendado",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-600"
      }
    }
    if (score >= 65) {
      return {
        text: "Buen candidato - Considerar para entrevista",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-yellow-600"
      }
    }
    if (score >= 50) {
      return {
        text: "Candidato promedio - Evaluación adicional",
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-orange-600"
      }
    }
    if (score >= 35) {
      return {
        text: "Candidato por debajo del promedio",
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-red-500"
      }
    }
    return {
      text: "Match bajo - No recomendado",
      icon: <TrendingDown className="h-4 w-4" />,
      color: "text-red-600"
    }
  }

  const trendInfo = getTrendInfo(customScore);

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
                        className="fill-foreground text-sm font-bold"
                      >
                        {customScore.toFixed(1)}
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
        <CardTitle>Custom Match Score</CardTitle>
        <CardDescription>{candidate.nombre_completo}</CardDescription>
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
            innerRadius={120}
            outerRadius={150}
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
                          {customScore.toFixed(1)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Score
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        
        {/* Detailed breakdown */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>Skills Técnicas: {breakdown.technicalSkills.toFixed(1)}/35</div>
            <div>Experiencia: {breakdown.experience.toFixed(1)}/25</div>
            <div>Seniority: {breakdown.seniority.toFixed(1)}/20</div>
            <div>Calificaciones: {breakdown.qualifications.toFixed(1)}/10</div>
            <div>Match Details: {breakdown.matchDetails.toFixed(1)}/5</div>
            <div>Distribución: {breakdown.skillsDistribution.toFixed(1)}/5</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className={`flex items-center gap-2 leading-none font-medium ${trendInfo.color}`}>
          {trendInfo.text} {trendInfo.icon}
        </div>
        <div className="text-muted-foreground leading-none">
          Algoritmo personalizado de evaluación técnica
        </div>
      </CardFooter>
    </Card>
  );
}