package routes

import (
	"net/http"

	"../mlib"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"

	"io/ioutil"
	"math/rand"
)

// ShowImages hhh
func ShowImages(c echo.Context) error {

	files, err := ioutil.ReadDir("/home/mandu/hc2/mmcpm/public/images/")
	mlib.CheckErr(err)

	select_file := rand.Intn(len(files) - 1)

	mlib.JIJI(files[select_file].Name())

	return c.Render(http.StatusOK, "show_images.html", map[string]interface{}{
		"name": files[select_file].Name(),
	})
}

// GetLogin hhh
func GetLogin(c echo.Context) error {
	return c.Render(http.StatusOK, "login.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostGoLogin hhh
func PostGoLogin(c echo.Context) error {

	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}

	if c.FormValue("user") == "mandu" && c.FormValue("passwd") == "kokolplp" {
		sess.Values["mmcpLogin"] = "mmcpLoginOk"
		sess.Save(c.Request(), c.Response())
		return c.Redirect(http.StatusMovedPermanently, "/memo10")
	}

	sess.Values["mmcpLogin"] = "no"
	sess.Save(c.Request(), c.Response())
	return c.Redirect(http.StatusMovedPermanently, "/")

	// if c.FormValue("p1") == "gusdk11!" ||
	// if (req.body.p2 === cmu.get_today())
	// if ((req.body.p3 === 'EMULATOR29X0X6X0') || (req.body.p3 === 'ca96aa47') || (req.body.p3 === '0123456789ABCDEF'))
	// {
	// 	const session = req.session;
	// 	session.check_passwd = '오케바리';
	// 	res.redirect('/sv1010');}
	// else
	// {
	// 	res.redirect('/users');
	// }

}
