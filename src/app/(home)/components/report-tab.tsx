import { CalendarDays, Clock } from 'lucide-react'

import { Card, CardContent } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'

interface ReportProps {
  report: {
    totalWorkedDays: number
    totalWorkedHours: number
    expectedWorkedHours: number
    balance: string
  }
}

export function ReportTab({ report }: ReportProps) {
  return (
    <Card className="h-full">
      <CardContent className="mt-6 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Dias trabalhados
          </span>
          <span>{report.totalWorkedDays} dias</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horas esperadas
          </span>
          <span>{report.expectedWorkedHours.toFixed(2)} horas</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horas trabalhadas
          </span>
          <span>{report.totalWorkedHours.toFixed(2)} horas</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center ">
          <span className="flex items-center gap-2">Saldo</span>

          <span
            data-isPositive={!report.balance.includes('-')}
            className="data-[isPositive=true]:text-green-400 data-[isPositive=false]:text-red-400"
          >
            {report.balance}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
