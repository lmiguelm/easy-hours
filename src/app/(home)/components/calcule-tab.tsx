import { ComponentProps } from 'react'
import { Calculator, Info, Clipboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface CalculeTabProps extends ComponentProps<typeof Textarea> {
  onPaste: () => void
  onCalc: () => void
  hasSpreadsheet: boolean
}

export function CalculeTab({
  onPaste,
  onCalc,
  hasSpreadsheet,
  ...props
}: CalculeTabProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-center">
        <h2 className="text-2xl">Cole abaixo o extrato do seu Timesheet</h2>

        <span className="flex items-center text-muted-foreground text-sm gap-2">
          <Info className="w-4 h-4" />
          Caso não tenha finalizado o dia atual, o mesmo não será contabilizado
          no extrato.
        </span>
      </CardHeader>

      <CardContent>
        <Textarea
          className="w-full h-[500px] p-4 resize-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary scrollbar-corner-secondary"
          placeholder="Cole as horas do mês aqui..."
          {...props}
        />
      </CardContent>

      <CardFooter>
        {hasSpreadsheet ? (
          <Button className="w-full gap-2" onClick={onCalc}>
            Calcular
            <Calculator className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={onPaste}
          >
            Colar
            <Clipboard className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
