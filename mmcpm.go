package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
	_ "net/http/pprof"
	"runtime"

	"./mlib"
	"./routes"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/middleware"
)

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {

	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}

func checkLogin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		if sess.Values["mmcpmLogin"] == "mmcpmLoginOk" {
			return next(c)
		}

		return c.Render(http.StatusOK, "user.html", map[string]interface{}{
			"name": "mandu",
		})
	}
}

func main() {
	runtime.GOMAXPROCS(2)
	//http.ListenAndServe(":8080", nil)

	e := echo.New()
	e.Pre(middleware.HTTPSRedirect())
	e.Use(middleware.Gzip())
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("mmcpSession"))))
	e.Static("/public", "public")

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}, header=${header}, query=${query}, form=${form}\n",
	}))

	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("views/*.html")),
	}
	e.Renderer = renderer

	e.POST("/images", routes.ShowImages)

	e.POST("/memo", routes.ListMemo)
	e.POST("/memo_view", routes.ViewMemo, checkLogin)
	e.POST("/memo_api/:id", routes.PostMemo, checkLogin)

	e.POST("/code", routes.ListCode)
	e.POST("/code_view", routes.ViewCode, checkLogin)
	e.POST("/code_api/:id", routes.PostCode, checkLogin)

	e.POST("/stock", routes.ListStock)
	e.POST("/stock_exe", routes.ListStockExe)
	e.POST("/stock_api/:id", routes.PostStock, checkLogin)

	mmcpConfig, err := mlib.GetConfig()
	mlib.CheckErr(err)

	e.Logger.Fatal(e.StartTLS(fmt.Sprintf(":%s", mmcpConfig["service_port"]), "./cert.pem", "./key.pem"))
}
