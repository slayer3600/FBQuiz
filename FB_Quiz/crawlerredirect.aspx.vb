Imports System.IO
Imports System.Web.Helpers

Public Class crawlerredirect
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        'https://developers.facebook.com/tools/debug/
        CreateMetaTags(Request.RawUrl)

    End Sub

    Private Sub CreateMetaTags(ByVal requestedURL As String)

        'looks like this: "/quiz/catbreedfactquiz"

        Dim myQuiz As String = requestedURL.Replace("/quiz/", "")
        Dim myPath As String = "~//data/" & myQuiz & ".json"

        If File.Exists(Server.MapPath(myPath)) Then

            Dim myJSON As String = File.ReadAllText(Server.MapPath(myPath))
            Dim myJSONObject As Object = Json.Decode(myJSON)

            Dim myTitle As String = myJSONObject.Title
            Dim myDescription As String = myJSONObject.Description
            Dim myImageURL As String = Request.Url.GetLeftPart(UriPartial.Authority) & "/" & myJSONObject.TitleScreenImageURL

            'Page.Header.Controls.Add(New LiteralControl("<meta property=""og:url"" content=""http://fb-quiz.azurewebsites.net/index.html"" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:type"" content=""article"" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:title"" content=""" & myTitle & """ />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:description"" content=""" & myDescription & """ />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:image"" content=""" & myImageURL & """ />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""fb:app_id"" content=""1589991301289201"" />"))

        Else
            'Requested json file does not exist, probably trying to share home/menu page

            Dim myImageURL As String = Request.Url.GetLeftPart(UriPartial.Authority) & "/" & "images/logo-lg.png"

            'Page.Header.Controls.Add(New LiteralControl("<meta property=""og:url"" content=""http://fb-quiz.azurewebsites.net/index.html"" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:type"" content=""article"" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:title"" content=""Pop Quizzes for everyone."" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:description"" content=""Test your knowledge and have fun at it!"" />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""og:image"" content=""" & myImageURL & """ />"))
            Page.Header.Controls.Add(New LiteralControl("<meta property=""fb:app_id"" content=""1589991301289201"" />"))

        End If



    End Sub

End Class