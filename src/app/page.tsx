'use client'

import { useMemo, useState } from 'react'
import { Calculator, CalendarDays, Clipboard, Clock, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { minutesToHours } from '@/utils/minutes-to-hour'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface Extract {
  totalWorkedDays: number
  totalWorkedHours: number
  expectedWorkedHours: number
}

export default function Home() {
  const [spreadsheet, setSpreadsheet] = useState<string>('')
  const [extract, setExtract] = useState<Extract | null>(null)
  const [activeTab, setActiveTab] = useState<string>('calcule')

  async function handlePaste() {
    const spreadsheet = await navigator.clipboard.readText()
    setSpreadsheet(spreadsheet)
  }

  function handleCalc() {
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

    setExtract({
      totalWorkedDays: totalWorkedDays.length,
      expectedWorkedHours: expectedTotalHours,
      totalWorkedHours,
    })

    setActiveTab('extract')
  }

  const balance = useMemo(() => {
    if (extract?.expectedWorkedHours && extract?.totalWorkedHours) {
      const balance = extract.totalWorkedHours - extract.expectedWorkedHours
      return `${balance.toFixed(2)} horas`
    }

    return '0 horas'
  }, [extract?.expectedWorkedHours, extract?.totalWorkedHours])

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[700px] h-[700px]"
      >
        <TabsList className="w-full rounded">
          <TabsTrigger
            id="teste1"
            className="rounded flex-1 gap-2"
            value="calcule"
          >
            <Calculator className="w-4 h-4" />
            Cálculo
          </TabsTrigger>

          <TabsTrigger
            id="teste"
            className="rounded flex-1 gap-2"
            value="extract"
            disabled={!extract}
          >
            <Clock className="w-4 h-4" />
            Extrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calcule">
          <Card>
            <CardHeader className="flex items-center justify-center">
              <h2 className="text-2xl">
                Cole abaixo o extrato do seu Timesheet
              </h2>

              <span className="flex items-center text-muted-foreground text-sm gap-2">
                <Info className="w-4 h-4" />
                Caso não tenha finalizado o dia atual, o mesmo não será
                contabilizado no extrato.
              </span>
            </CardHeader>

            <CardContent>
              <Textarea
                className="w-full h-[500px] p-4 resize-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary scrollbar-corner-secondary"
                placeholder="Cole as horas do mês aqui..."
                value={spreadsheet}
                onChange={(value) => setSpreadsheet(value.target.value)}
              />
            </CardContent>

            <CardFooter>
              {spreadsheet.length ? (
                <Button className="w-full gap-2" onClick={handleCalc}>
                  Calcular
                  <Calculator className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={handlePaste}
                >
                  Colar
                  <Clipboard className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="extract" className="h-full">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-center">
              <h2 className="text-2xl flex items-center gap-2">
                Aqui está o extrato do seu Timesheet
              </h2>
            </CardHeader>

            <CardContent className="mt-4 flex flex-col gap-2">
              <Separator />

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Dias trabalhados
                </span>
                <span>{extract?.totalWorkedDays} dias</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horas esperadas
                </span>
                <span>{extract?.expectedWorkedHours.toFixed(2)} horas</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horas trabalhadas
                </span>
                <span>{extract?.totalWorkedHours.toFixed(2)} horas</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center ">
                <span className="flex items-center gap-2">Saldo</span>

                <span
                  data-isPositive={!balance.includes('-')}
                  className="data-[isPositive=true]:text-green-400 data-[isPositive=false]:text-red-400"
                >
                  {balance}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
