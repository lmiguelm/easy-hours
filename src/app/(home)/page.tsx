'use client'

import { useCallback, useMemo, useState } from 'react'
import { Calculator, Clock } from 'lucide-react'

import { minutesToHours } from '@/utils/minutes-to-hour'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportTab } from './components/report-tab'
import { CalculeTab } from './components/calcule-tab'
import { toast } from 'sonner'
import { DAYS_OF_THE_WEEK } from '@/utils/days'

const IS_VALID_DATE = /\d{2}\/\d{2}\/\d{4}/
const HOURS_WORKED_A_DAY = 8
const MINUTES_WORKED_INDEX = 7
const DATE_INDEX = 0

interface Report {
  totalWorkedDays: number
  totalWorkedHours: number
  expectedWorkedHours: number
}

export default function Home() {
  const [spreadsheet, setSpreadsheet] = useState<string>('')
  const [report, setReport] = useState<Report | null>(null)
  const [activeTab, setActiveTab] = useState<string>('calcule')

  const handlePaste = useCallback(async () => {
    const spreadsheet = await navigator.clipboard.readText()
    setSpreadsheet(spreadsheet)
  }, [])

  function isValidInput(input: string) {
    return input.match(IS_VALID_DATE)
  }

  function formatSpreadsheet(spreadsheet: string) {
    return spreadsheet
      .replace(/(\r\n)/gm, '') // remove \n and \n
      .replace(/(\t)/gm, ' | ') // change \t to |
  }

  function getTotalMinutesWorkedPerDay(day: string) {
    const minutes = Number(day.split('|')[MINUTES_WORKED_INDEX] ?? 0)

    if (isNaN(minutes)) {
      return 0
    }

    return minutes
  }

  function checkIfDateIsWeekend(dateString: string) {
    const [day, month, year] = dateString.split('/')

    const date = new Date(+year, +month - 1, +day)

    return (
      date.getDay() === DAYS_OF_THE_WEEK.SATURDAY ||
      date.getDay() === DAYS_OF_THE_WEEK.SUNDAY
    )
  }

  const getTotalWorkedDays = useCallback((days: string[]) => {
    return days
      .filter((day) => {
        const totalWorkedMinutes = getTotalMinutesWorkedPerDay(day)
        return totalWorkedMinutes > 0
      })
      .map((day) => {
        const date = day.split('|')[DATE_INDEX]

        const isWeekend = checkIfDateIsWeekend(date)

        return {
          day,
          isWeekend,
        }
      })
  }, [])

  const getTotalMinuteWorked = useCallback(
    (totalWorkedDays: { day: string; isWeekend: boolean }[]) => {
      return totalWorkedDays.reduce(
        (acc, row) => acc + getTotalMinutesWorkedPerDay(row.day),
        0,
      )
    },
    [],
  )

  const handleCalc = useCallback(() => {
    if (!isValidInput(spreadsheet)) {
      return toast('Não foi possível extrair as horas!', {
        description: 'Verifique se os dados foram informados corretamente.',
      })
    }

    const formattedSpreadSheet = formatSpreadsheet(spreadsheet)
    const days = formattedSpreadSheet.split('\n')

    const totalDaysWorked = getTotalWorkedDays(days)
    const totalMinutesWorked = getTotalMinuteWorked(totalDaysWorked)

    const totalWorkingDaysWorked = totalDaysWorked.filter(
      (day) => !day.isWeekend,
    )

    const expectedTotalHours =
      totalWorkingDaysWorked.length * HOURS_WORKED_A_DAY

    const totalWorkedHours = minutesToHours(totalMinutesWorked)

    setReport({
      totalWorkedDays: totalDaysWorked.length,
      expectedWorkedHours: expectedTotalHours,
      totalWorkedHours,
    })

    setActiveTab('report')
  }, [getTotalMinuteWorked, getTotalWorkedDays, spreadsheet])

  const balance = useMemo(() => {
    if (report?.expectedWorkedHours && report?.totalWorkedHours) {
      const balance = report.totalWorkedHours - report.expectedWorkedHours
      return `${balance.toFixed(2)} horas`
    }

    return '0 horas'
  }, [report?.expectedWorkedHours, report?.totalWorkedHours])

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[750px] h-[500px]"
      >
        <TabsList className="w-full rounded">
          <TabsTrigger className="rounded flex-1 gap-2" value="calcule">
            <Calculator className="w-4 h-4" />
            Cálculo
          </TabsTrigger>

          <TabsTrigger
            className="rounded flex-1 gap-2"
            value="report"
            disabled={!report}
          >
            <Clock className="w-4 h-4" />
            Extrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calcule">
          <CalculeTab
            hasSpreadsheet={!!spreadsheet.length}
            onCalc={handleCalc}
            onPaste={handlePaste}
            value={spreadsheet}
            onChange={(event) => setSpreadsheet(event.target.value)}
          />
        </TabsContent>

        <TabsContent value="report" className="h-full">
          <ReportTab
            report={{
              balance,
              expectedWorkedHours: report?.expectedWorkedHours ?? 0,
              totalWorkedDays: report?.totalWorkedDays ?? 0,
              totalWorkedHours: report?.totalWorkedHours ?? 0,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
