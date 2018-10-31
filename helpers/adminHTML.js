/*  HTML USER EDIT FORM TEMPLATE
  <div>
    <div class="result-card uk-card uk-card-default uk-card-small">
      <div class="uk-card-header">
        <h4 class="uk-card-title">${user.name}</h4>
      </div>
      <form action="${window.location.href}" method="POST" enctype="application/x-www-form-urlencoded" id="update-user" class="uk-card-body">
        <div class="result-field">
          <label>Role </label>
          <select name="role">
            <option value="${user.role}" selected disabled>${user.role}</option>
            <option value="admin">Administrator</option>
            <option value="user">User</option>
          </select>
        </div>
        <div class="result-field">
          <label>Phone </label>
          <input name="username" value="${user.username}" placeholder="${user.username}" required>
        </div>
        <div class="result-field">
          <label>Email </label>
          <input name="email" value="${user.email}" placeholder="${user.email}" required>
        </div>
        <div class="result-field">
          <label>Name </label>
          <input name="name" value="${user.name}" placeholder="${user.name}" required>
        </div>
        <div class="result-field">
          <label>Age </label>
          <input name="age" value="${user.age}" placeholder="${user.age}" type="number">
        </div>
        <div class="result-field">
          <label>Gender </label>
          <select name="gender">
            <option value="${user.gender}" selected disabled>${user.gender}</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="result-field">
          <label>Address </label>
          <input name="address" value="${user.address}" placeholder="${user.address}">
        </div>
        <input type="hidden" name="userID" value="${user._id}">
        <div class="submit-form">
          <button type="submit">Update</button>
          <button data-event="delete" data-click="${window.location.href}/delete/${user._id}" type="button">Delete</button>
        </div>
      </form>
    </div>
  </div>
*/

exports.noResults = () => '<div><div class="result-card uk-card uk-card-default uk-card-body uk-card-small"><p class="no-results">Nothing was found. Try with another search.</p></div></div>'

exports.userEditForm = () => '<div><div class="result-card uk-card uk-card-default uk-card-small"><div class="uk-card-header"><h4 class="uk-card-title">${user.name}</h4></div><form action="${window.location.href}" method="POST" enctype="application/x-www-form-urlencoded" id="update-user" class="uk-card-body"><div class="result-field"><label>Role </label><select name="role"><option value="${user.role}" selected disabled>${user.role}</option><option value="admin">Administrator</option><option value="user">User</option></select></div><div class="result-field"><label>Phone </label><input name="username" value="${user.username}" placeholder="${user.username}" required></div><div class="result-field"><label>Email </label><input name="email" value="${user.email}" placeholder="${user.email}" required></div><div class="result-field"><label>Name </label><input name="name" value="${user.name}" placeholder="${user.name}" required></div><div class="result-field"><label>Age </label><input name="age" value="${user.age}" placeholder="${user.age}" type="number"></div><div class="result-field"><label>Gender </label><select name="gender"><option value="${user.gender}" selected disabled>${user.gender}</option><option value="male">Male</option><option value="female">Female</option></select></div><div class="result-field"><label>Address </label><input name="address" value="${user.address}" placeholder="${user.address}"></div><input type="hidden" name="userID" value="${user._id}"><div class="submit-form"><button type="submit">Update</button><button data-event="delete" data-click="${window.location.href}/delete/${user._id}" type="button">Delete</button></div></form></div></div>';

exports.offerEditForm = () => '<div> <div class="result-card uk-card uk-card-default uk-card-small"> <div class="uk-card-header"> <h4 class="uk-card-title">${offer.name}</h4> </div><form action="${window.location.href}" method="POST" enctype="application/x-www-form-urlencoded" id="update-user" class="uk-card-body"> <div class="result-field"> <label>Name </label> <input name="name" value="${offer.name}" placeholder="${offer.name}" required> </div><div class="result-field"> <label>Alias </label> <input name="alias" value="${offer.alias}" placeholder="${offer.alias}" required> </div><div class="result-field"> <label>Product </label> <input name="productId" value="${offer.productId.name}" placeholder="${offer.productId.name}" required> </div><div class="result-field"> <label>Pharmacy </label> <input name="pharmacyId" value="${offer.pharmacyId.name}" placeholder="${offer.pharmacyId.name}" required> </div><div class="result-field"> <label>Price </label> <input name="price" value="${offer.price}" placeholder="${offer.price}" type="number" required> </div><div class="result-field"> <label>Discount </label> <input name="discount" value="${offer.discount}" placeholder="${offer.discount}" type="number" required> </div><div class="result-field"> <label>Validity </label> <input name="validity" value="${offer.validity}" placeholder="${offer.validity}" type="date" required> </div><div class="result-field"> <label>Terms </label> <input name="terms" value="${offer.terms}" placeholder="${offer.terms}"> </div><input type="hidden" name="offerID" value="${offer._id}"> <div class="submit-form"> <button type="submit">Update</button> <button data-event="delete" data-click="${window.location.href}/delete/${offer._id}" type="button">Delete</button> </div></form> </div></div>';