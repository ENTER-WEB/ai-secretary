workspace "System Development OS Example" "Replace this model with the target system." {
  model {
    user = person "User" "Uses the target system."
    system = softwareSystem "Target System" "Delivers the intended outcome."
    external = softwareSystem "External System" "Provides an external dependency."
    user -> system "Uses"
    system -> external "Calls"
  }
  views {
    systemContext system "SystemContext" {
      include *
      autoLayout lr
    }
    styles {
      element "Person" { shape person }
      element "Software System" { background #1168bd; color #ffffff }
    }
  }
}

