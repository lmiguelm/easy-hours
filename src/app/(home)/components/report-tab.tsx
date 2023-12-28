import { CalendarDays, Clock } from 'lucide-react'

import { Card, CardContent } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import { InlineItem } from '@/components/inline-item'

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
        <InlineItem.Root>
          <InlineItem.Wrapper>
            <InlineItem.Icon icon={CalendarDays} />
            <span>Dias trabalhados</span>
          </InlineItem.Wrapper>

          <span>{report.totalWorkedDays} dias</span>
        </InlineItem.Root>

        <Separator />

        <InlineItem.Root>
          <InlineItem.Wrapper>
            <InlineItem.Icon icon={Clock} />
            <span>Horas esperadas</span>
          </InlineItem.Wrapper>

          <span>{report.expectedWorkedHours} horas</span>
        </InlineItem.Root>

        <Separator />

        <InlineItem.Root>
          <InlineItem.Wrapper>
            <InlineItem.Icon icon={Clock} />
            <span>Horas trabalhadas</span>
          </InlineItem.Wrapper>

          <span>{report.totalWorkedHours} horas</span>
        </InlineItem.Root>
        <Separator />

        <InlineItem.Root>
          <InlineItem.Wrapper>
            <span>Saldo</span>
          </InlineItem.Wrapper>

          <span
            data-isPositive={!report.balance.includes('-')}
            className="data-[isPositive=true]:text-green-400 data-[isPositive=false]:text-red-400"
          >
            {report.balance}
          </span>
        </InlineItem.Root>
      </CardContent>
    </Card>
  )
}
