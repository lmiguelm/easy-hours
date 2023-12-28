'use client'

import { useCallback, useMemo, useState } from 'react'
import { Calculator, Clock } from 'lucide-react'

import { minutesToHours } from '@/utils/minutes-to-hour'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportTab } from './components/report-tab'
import { CalculeTab } from './components/calcule-tab'

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

  const handleCalc = useCallback(() => {
    const formattedSpreadSheet = spreadsheet
      .replace(/(\r\n)/gm, '') // remove \n and \n
      .replace(/(\t)/gm, ' | ') // change \t to |

    const allDays = formattedSpreadSheet.split(/\d{2}\/\d{2}\/\d{4}/) // getting from date

    const totalWorkedDays = allDays
      .filter((day) => !day.includes('-'))
      .filter(Boolean) // remove empty days

    const totalMinutesWorked = totalWorkedDays.reduce(
      (acc, currentValue) => acc + Number(currentValue.split('|')[7] ?? 0),
      0,
    )

    const expectedTotalHours = totalWorkedDays.length * 8
    const totalWorkedHours = minutesToHours(totalMinutesWorked)

    setReport({
      totalWorkedDays: totalWorkedDays.length,
      expectedWorkedHours: expectedTotalHours,
      totalWorkedHours,
    })

    setActiveTab('report')
  }, [spreadsheet])

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
        className="w-[700px] h-[700px]"
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
