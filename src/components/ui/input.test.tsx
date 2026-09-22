import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "./input"

describe("Input component", () => {
  it("no muestra el botón de limpiar si el valor está vacío", () => {
    render(<Input label="Ciudad" value="" readOnly onClear={jest.fn()} />)
    expect(screen.queryByLabelText("Limpiar campo")).not.toBeInTheDocument()
  })

  it("no muestra el botón de limpiar si el campo es readOnly y no tiene onClear", () => {
    render(<Input label="Estado" value="Activo" readOnly />)
    expect(screen.queryByLabelText("Limpiar campo")).not.toBeInTheDocument()
  })

  it("muestra el botón de limpiar cuando hay un valor y onClear está provisto (selector readOnly)", () => {
    render(<Input label="Ciudad" value="Rosario" readOnly onClear={jest.fn()} />)
    expect(screen.getByLabelText("Limpiar campo")).toBeInTheDocument()
  })

  it("al presionar el botón de limpiar en un selector invoca la función onClear", () => {
    const handleClear = jest.fn()
    render(<Input label="Ciudad" value="Rosario" readOnly onClear={handleClear} />)
    const clearBtn = screen.getByLabelText("Limpiar campo")
    fireEvent.click(clearBtn)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it("al presionar el botón de limpiar en un input editable estándar limpia el valor", () => {
    render(<Input label="Nombre" defaultValue="Pablo" />)
    const input = screen.getByLabelText("Nombre") as HTMLInputElement
    expect(input.value).toBe("Pablo")

    const clearBtn = screen.getByLabelText("Limpiar campo")
    fireEvent.click(clearBtn)
    expect(input.value).toBe("")
  })
})
