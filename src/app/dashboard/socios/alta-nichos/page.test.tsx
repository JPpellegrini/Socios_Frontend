import AltaNichosRedirectPage from "./page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("AltaNichosRedirectPage", () => {
  it("redirige a /dashboard/nichos", () => {
    AltaNichosRedirectPage();
    expect(redirect).toHaveBeenCalledWith("/dashboard/nichos");
  });
});
