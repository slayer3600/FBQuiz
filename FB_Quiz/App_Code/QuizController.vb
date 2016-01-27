Imports System.Net
Imports System.Web.Http

Public Class QuizController
    Inherits ApiController

    ' GET api/<controller>
    Public Function GetValues() As IEnumerable(Of String)
        Return New String() {"value1", "value2"}

    End Function

    ' GET api/<controller>/5
    Public Function GetValue(ByVal id As Integer) As String
        Return "value"
    End Function

    ' POST api/<controller>
    Public Sub PostValue(<FromBody()> ByVal value As String)

    End Sub

    ' PUT api/<controller>/5
    Public Sub PutValue(ByVal id As Integer, <FromBody()> ByVal value As String)

    End Sub

    ' DELETE api/<controller>/5
    Public Sub DeleteValue(ByVal id As Integer)

    End Sub

    Public Function GetQuizMenuItems() As List(Of QuizMenuItem)

        Dim myQuizMenuItems As New QuizMenuItems
        Return myQuizMenuItems.GetAllQuizMenuItems

    End Function

    Public Sub AddNewQuiz(ByVal value As Quiz)

        Dim myQuiz As New Quiz
        myQuiz.SaveQuiz(value)

    End Sub

    Public Function GetIsAuthorized() As Boolean

        Dim myClientIPAddress As String = HttpContext.Current.Request.UserHostAddress
        Dim myAllowedIPs As String() = {"::1", "74.94.78.49"}
        Dim IsAllowed As Boolean = False

        For Each s As String In myAllowedIPs
            If s.Contains(myClientIPAddress) Then
                IsAllowed = True
            End If
        Next

        Return IsAllowed

    End Function

End Class
